import { mapActions, mapGetters } from 'vuex';
import employeesTablet from '@/components/adaptive/employees-tablet';
import socials from '@/constants/socials';
import employeeMixin from '@/constants/employee-mixin';

export default {
    name: 'employees-list',
    components: {
        'employees-tablet': employeesTablet
    },
    data: function () {
        return {
            socials: socials,
            orderProps: [
                { name: 'Last Name', value: 'lastName' },
                { name: 'Email', value: 'email' },
                { name: 'Is coordinator', value: 'isCoordinator' },
                { name: 'Coordinator', value: 'coordinator.lastname' },
                { name: 'Position', value: 'position' },
                { name: 'Schedule', value: 'schedule' },
                { name: 'Experience', value: 'period' }
            ],
            viewModuleIconName: 'mdi-view-list',
            pagination: {},
            loading: false,
            paginationEmployees: {
                currentPage: 1,
                itemsPerPage: 10,
                resultCount: 0,
                currentItemsPerPage: 0,
                currentMaxItemsPerPage: 0
            }
        };
    },
    created() {
        this.loading = true;
        this.$store.dispatch('fetchEmployees').then(res => {
            this.loading = false;
        }, err => this.loading = false);
    },
    computed: {
        ...mapGetters({
            employees: 'getEmployees',
            cardMode: 'getCardMode',
            options: 'getOptions',
        })
    },
    setOrder: function (item) {
        this.editOptions(item);
        this.orderProps.forEach(entry => {
            entry.clicked === true && (entry.clicked = false);
        });
        item.clicked = true;
    },
    mixins: [employeeMixin],
    methods: {
        ...mapActions(['editCardMode', 'editOptions']),
        setOrder: function (item) {
            this.editOptions(item);
            this.orderProps.forEach(entry => {
                entry.clicked && (entry.clicked = false);
            });
            item.clicked = true;
        },
        toggleView: function () {
            this.editCardMode();
            this.viewModuleIconName =
                this.viewModuleIconName === 'mdi-view-module'
                    ? 'mdi-view-list'
                    : 'mdi-view-module';
        },
        orderByOptions: function (arrayToOrder, prop, descending) {
            let orderedArray;
            arrayToOrder = this.filterEmplooyees(arrayToOrder);
            if (prop === 'coordinator.lastname') {
                arrayToOrder.forEach(entry => {
                    if (!entry.coordinator)
                        entry.coordinator = { lastname: '' };
                });
                orderedArray = arrayToOrder.slice().sort((a, b) => {
                    return a.coordinator.lastname < b.coordinator.lastname
                        ? -1
                        : 1;
                });
            } else {
                orderedArray = arrayToOrder.slice().sort((a, b) => {
                    return (a[prop] ? a[prop] : '') < (b[prop] ? b[prop] : '')
                        ? -1
                        : 1;
                });
            }
            return descending ? orderedArray : orderedArray.reverse();
        },
        getOrderProps: function () {
            this.orderProps.forEach(entry => {
                entry.value === this.options.order && (entry.clicked = true);
            });
            return this.orderProps;
        },
        employeeViewMobile: function (id) {
            this.$store.dispatch('setGoBack', true);
            return this.$router.push({
                name: 'EmployeeViewMobile',
                params: { userId: id }
            });
        }
    }
}